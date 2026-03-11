const fetch = globalThis.fetch;

// ---------------------------------------------------------------------------
// GitHub Contributions (GraphQL API, requires GITHUB_TOKEN)
// ---------------------------------------------------------------------------

async function fetchGitHubContributions(reporter) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    reporter.warn("GITHUB_TOKEN not set — skipping GitHub contributions");
    return {};
  }

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  const query = `
    query {
      user(login: "svachmic") {
        contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      reporter.warn(`GitHub GraphQL API returned ${res.status}`);
      return {};
    }

    const json = await res.json();
    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (!weeks) {
      reporter.warn("Unexpected GitHub GraphQL response shape");
      return {};
    }

    const map = {};
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          map[day.date] = day.contributionCount;
        }
      }
    }
    return map;
  } catch (e) {
    reporter.warn(`GitHub contributions fetch failed: ${e.message}`);
    return {};
  }
}

// ---------------------------------------------------------------------------
// GitLab Contributions (public calendar JSON, no auth)
// ---------------------------------------------------------------------------

async function fetchGitLabContributions(reporter) {
  try {
    const res = await fetch("https://gitlab.com/users/svachmic/calendar.json");
    if (!res.ok) {
      reporter.warn(`GitLab calendar API returned ${res.status}`);
      return {};
    }
    const data = await res.json();
    const map = {};
    for (const [date, count] of Object.entries(data)) {
      if (count > 0) map[date] = count;
    }
    return map;
  } catch (e) {
    reporter.warn(`GitLab contributions fetch failed: ${e.message}`);
    return {};
  }
}

// ---------------------------------------------------------------------------
// Featured Repo Stats (GraphQL API, requires GITHUB_TOKEN)
// ---------------------------------------------------------------------------

const FEATURED_REPO_DEFAULTS = { loc: 57000, commits: 4, license: "MPL-2.0" };

async function fetchFeaturedRepoStats(reporter) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    reporter.warn("GITHUB_TOKEN not set — using default featured repo stats");
    return FEATURED_REPO_DEFAULTS;
  }

  const query = `
    query {
      repository(owner: "svachmic", name: "gbkt") {
        licenseInfo { spdxId }
        languages(first: 10) { edges { size node { name } } }
        defaultBranchRef {
          target { ... on Commit { history { totalCount } } }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      reporter.warn(
        `GitHub GraphQL API returned ${res.status} for featured repo`,
      );
      return FEATURED_REPO_DEFAULTS;
    }

    const json = await res.json();
    const repo = json.data?.repository;
    if (!repo) {
      reporter.warn("Unexpected GitHub GraphQL response for featured repo");
      return FEATURED_REPO_DEFAULTS;
    }

    const totalBytes = (repo.languages?.edges || []).reduce(
      (sum, edge) => sum + edge.size,
      0,
    );
    const loc =
      Math.round(totalBytes / 35 / 1000) * 1000 || FEATURED_REPO_DEFAULTS.loc;
    const commits =
      repo.defaultBranchRef?.target?.history?.totalCount ||
      FEATURED_REPO_DEFAULTS.commits;
    const license = repo.licenseInfo?.spdxId || FEATURED_REPO_DEFAULTS.license;

    return { loc, commits, license };
  } catch (e) {
    reporter.warn(`Featured repo stats fetch failed: ${e.message}`);
    return FEATURED_REPO_DEFAULTS;
  }
}

// ---------------------------------------------------------------------------
// Stub data generator (deterministic, for local development)
// ---------------------------------------------------------------------------

function generateStubData() {
  // Simple seeded PRNG (mulberry32)
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(42);
  const github = {};
  const gitlab = {};

  const end = new Date();
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);

  const d = new Date(start);
  while (d <= end) {
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const activityMultiplier = isWeekday ? 3 : 1;

    // ~60% chance of GitHub activity on eligible days
    if (rand() < 0.6 * (activityMultiplier / 3)) {
      github[dateStr] = Math.ceil(rand() * 15);
    }

    // ~40% chance of GitLab activity
    if (rand() < 0.4 * (activityMultiplier / 3)) {
      gitlab[dateStr] = Math.ceil(rand() * 10);
    }

    d.setDate(d.getDate() + 1);
  }

  return { github, gitlab };
}

// ---------------------------------------------------------------------------
// Build the contribution calendar structure from two date→count maps
// ---------------------------------------------------------------------------

function buildContributionCalendar(githubMap, gitlabMap) {
  const end = new Date();
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);

  // Rewind start to the preceding Sunday
  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1);
  }

  // Collect all days
  const allDays = [];
  const d = new Date(start);
  while (d <= end) {
    const dateStr = d.toISOString().slice(0, 10);
    const gh = githubMap[dateStr] || 0;
    const gl = gitlabMap[dateStr] || 0;
    const total = gh + gl;
    let source = "none";
    if (gh > 0 && gl > 0) source = "both";
    else if (gh > 0) source = "github";
    else if (gl > 0) source = "gitlab";

    allDays.push({
      date: dateStr,
      githubCount: gh,
      gitlabCount: gl,
      totalCount: total,
      source,
      _weekday: d.getDay(),
    });
    d.setDate(d.getDate() + 1);
  }

  // Compute quartile-based levels on non-zero totals
  const nonZero = allDays
    .map((d) => d.totalCount)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);

  let thresholds = [1, 2, 3, 4]; // fallback
  if (nonZero.length > 0) {
    const q1 = nonZero[Math.floor(nonZero.length * 0.25)];
    const q2 = nonZero[Math.floor(nonZero.length * 0.5)];
    const q3 = nonZero[Math.floor(nonZero.length * 0.75)];
    thresholds = [q1, q2, q3];
  }

  for (const day of allDays) {
    if (day.totalCount === 0) {
      day.level = 0;
    } else if (day.totalCount <= thresholds[0]) {
      day.level = 1;
    } else if (day.totalCount <= thresholds[1]) {
      day.level = 2;
    } else if (day.totalCount <= thresholds[2]) {
      day.level = 3;
    } else {
      day.level = 4;
    }
  }

  // Group into weeks (Sun→Sat)
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const weekDays = allDays.slice(i, i + 7).map((day) => ({
      date: day.date,
      githubCount: day.githubCount,
      gitlabCount: day.gitlabCount,
      totalCount: day.totalCount,
      level: day.level,
      source: day.source,
    }));

    // Pad the last week if incomplete
    while (weekDays.length < 7) {
      weekDays.push({
        date: "",
        githubCount: 0,
        gitlabCount: 0,
        totalCount: 0,
        level: 0,
        source: "none",
      });
    }

    weeks.push({ contributionDays: weekDays });
  }

  // Extract month labels
  const MONTH_NAMES = [
    "Led",
    "Úno",
    "Bře",
    "Dub",
    "Kvě",
    "Čvn",
    "Čvc",
    "Srp",
    "Zář",
    "Říj",
    "Lis",
    "Pro",
  ];

  const months = [];
  let lastMonth = -1;
  for (let wi = 0; wi < weeks.length; wi++) {
    const firstDay = weeks[wi].contributionDays[0];
    if (!firstDay.date) continue;
    const m = new Date(firstDay.date + "T00:00:00").getMonth();
    if (m !== lastMonth) {
      months.push({
        name: MONTH_NAMES[m],
        number: m + 1,
        firstWeekIndex: wi,
        totalWeeks: 0,
      });
      lastMonth = m;
    }
  }
  // Compute totalWeeks for each month
  for (let i = 0; i < months.length; i++) {
    const nextStart =
      i + 1 < months.length ? months[i + 1].firstWeekIndex : weeks.length;
    months[i].totalWeeks = nextStart - months[i].firstWeekIndex;
  }

  const totalContributions = allDays.reduce(
    (sum, day) => sum + day.totalCount,
    0,
  );

  return { weeks, months, totalContributions };
}

// ---------------------------------------------------------------------------
// Parse markdown-style links in Now status text into typed segments
// ---------------------------------------------------------------------------

function parseNowText(text) {
  if (!text) return [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    let domain = match[2];
    try {
      domain = new URL(match[2]).hostname;
    } catch {}
    segments.push({ type: "link", value: match[1], url: match[2], domain });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

// ---------------------------------------------------------------------------
// Gatsby API: sourceNodes
// ---------------------------------------------------------------------------

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions;

  // --- Now status ---
  let nowText = "";
  let nowDate = "";

  if (process.env.STUB_NOW === "true") {
    nowText =
      "Přemlouvám [Gatsby](https://www.gatsbyjs.com) a Netlify ke spolupráci. Na všechno ostatní je tady...Claude 🧠😬";
    nowDate = new Date().toISOString();
    reporter.info("Using stub Now data");
  } else {
    try {
      const nowRes = await fetch("https://svachmic.cz/api/now");
      if (nowRes.ok) {
        const nowData = await nowRes.json();
        nowText = nowData.text || "";
        nowDate = nowData.date || "";
      }
    } catch (e) {
      reporter.warn(`Now status fetch failed: ${e.message}`);
    }
  }

  const segments = parseNowText(nowText);

  createNode({
    text: nowText,
    date: nowDate,
    segments,
    id: createNodeId("now-status"),
    internal: {
      type: "NowStatus",
      contentDigest: createContentDigest({
        text: nowText,
        date: nowDate,
        segments,
      }),
    },
  });

  // --- Featured repo stats ---
  let repoStats;

  if (process.env.STUB_CONTRIBUTIONS === "true") {
    repoStats = FEATURED_REPO_DEFAULTS;
    reporter.info("Using stub featured repo stats");
  } else {
    repoStats = await fetchFeaturedRepoStats(reporter);
  }

  createNode({
    ...repoStats,
    id: createNodeId("featured-repo"),
    internal: {
      type: "FeaturedRepo",
      contentDigest: createContentDigest(repoStats),
    },
  });

  // --- Contribution calendar ---
  let githubMap, gitlabMap;

  if (process.env.STUB_CONTRIBUTIONS === "true") {
    const stub = generateStubData();
    githubMap = stub.github;
    gitlabMap = stub.gitlab;
    reporter.info("Using stub contribution data");
  } else {
    [githubMap, gitlabMap] = await Promise.all([
      fetchGitHubContributions(reporter),
      fetchGitLabContributions(reporter),
    ]);
  }

  const calendar = buildContributionCalendar(githubMap, gitlabMap);

  createNode({
    ...calendar,
    id: createNodeId("contribution-calendar"),
    internal: {
      type: "ContributionCalendar",
      contentDigest: createContentDigest(calendar),
    },
  });
};

// ---------------------------------------------------------------------------
// Gatsby API: createSchemaCustomization
// ---------------------------------------------------------------------------

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type NowStatus implements Node {
      text: String
      date: String
      segments: [NowSegment!]!
    }

    type NowSegment {
      type: String!
      value: String!
      url: String
      domain: String
    }

    type FeaturedRepo implements Node {
      loc: Int!
      commits: Int!
      license: String!
    }

    type ContributionCalendar implements Node {
      totalContributions: Int!
      weeks: [ContributionWeek!]!
      months: [ContributionMonth!]!
    }

    type ContributionWeek {
      contributionDays: [ContributionDay!]!
    }

    type ContributionDay {
      date: String!
      githubCount: Int!
      gitlabCount: Int!
      totalCount: Int!
      level: Int!
      source: String!
    }

    type ContributionMonth {
      name: String!
      number: Int!
      firstWeekIndex: Int!
      totalWeeks: Int!
    }
  `);
};

// ---------------------------------------------------------------------------
// Gatsby API: onCreateWebpackConfig
// ---------------------------------------------------------------------------

exports.onCreateWebpackConfig = ({ actions, loaders }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/@svachmic\/shared/,
          use: [loaders.js()],
        },
      ],
    },
  });
};
