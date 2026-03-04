import * as React from "react"

const MOBILE_WEEKS = 26

function getCellClass(source, level) {
  if (level === 0 || source === "none") return "contrib__cell--level-0"
  return `contrib__cell--${source}-${level}`
}

function formatTooltip(day) {
  const { date, totalCount, githubCount, gitlabCount } = day
  if (totalCount === 0) return `Žádné příspěvky — ${date}`
  const word =
    totalCount === 1
      ? "příspěvek"
      : totalCount >= 2 && totalCount <= 4
        ? "příspěvky"
        : "příspěvků"
  return `${totalCount} ${word} (GitHub: ${githubCount}, GitLab: ${gitlabCount}) — ${date}`
}

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [breakpoint])
  return isMobile
}

const DAY_LABELS = ["", "Po", "", "St", "", "Pá", ""]

const ContributionGraph = ({ weeks, months, totalContributions }) => {
  const isMobile = useIsMobile()

  const visibleWeeks = isMobile ? weeks.slice(-MOBILE_WEEKS) : weeks
  const weekOffset = isMobile ? weeks.length - MOBILE_WEEKS : 0

  const visibleMonths = React.useMemo(() => {
    return months
      .filter((m) => {
        const start = m.firstWeekIndex
        const end = start + m.totalWeeks
        return end > weekOffset && start < weekOffset + visibleWeeks.length
      })
      .map((m) => ({
        ...m,
        firstWeekIndex: Math.max(0, m.firstWeekIndex - weekOffset),
      }))
  }, [months, weekOffset, visibleWeeks.length])

  const totalCols = visibleWeeks.length

  const word =
    totalContributions === 1
      ? "příspěvek"
      : totalContributions >= 2 && totalContributions <= 4
        ? "příspěvky"
        : "příspěvků"

  return (
    <section className="contrib">
      <span className="contrib__title">Aktivita</span>
      <div className="contrib__graph">
        <div
          className="contrib__months"
          style={{
            gridTemplateColumns: isMobile
              ? `repeat(${totalCols}, 1fr)`
              : `24px repeat(${totalCols}, 1fr)`,
          }}
        >
          {visibleMonths.map((month, i) => (
            <span
              key={i}
              className="contrib__month-label"
              style={{
                gridColumnStart: isMobile
                  ? month.firstWeekIndex + 1
                  : month.firstWeekIndex + 2,
              }}
            >
              {month.number}
            </span>
          ))}
        </div>
        <div
          className="contrib__grid"
          style={{
            gridTemplateColumns: isMobile
              ? `repeat(${totalCols}, 1fr)`
              : `24px repeat(${totalCols}, 1fr)`,
          }}
        >
          {!isMobile && (
            <div className="contrib__day-labels">
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="contrib__day-label">
                  {label}
                </span>
              ))}
            </div>
          )}
          {visibleWeeks.map((week, wi) => (
            <div key={wi} className="contrib__week">
              {week.contributionDays.map((day, di) => (
                <div
                  key={di}
                  className={`contrib__cell ${getCellClass(day.source, day.level)}`}
                  title={formatTooltip(day)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="contrib__footer">
        <span className="contrib__total">
          {totalContributions} {word} za posledních {isMobile ? 6 : 12} měsíců
        </span>
        <div className="contrib__legend">
          <div className="contrib__legend-group">
            <span className="contrib__legend-label">GitHub</span>
            <div className="contrib__cell contrib__cell--github-1" />
            <div className="contrib__cell contrib__cell--github-2" />
            <div className="contrib__cell contrib__cell--github-3" />
            <div className="contrib__cell contrib__cell--github-4" />
          </div>
          <div className="contrib__legend-group">
            <span className="contrib__legend-label">GitLab</span>
            <div className="contrib__cell contrib__cell--gitlab-1" />
            <div className="contrib__cell contrib__cell--gitlab-2" />
            <div className="contrib__cell contrib__cell--gitlab-3" />
            <div className="contrib__cell contrib__cell--gitlab-4" />
          </div>
          <div className="contrib__legend-group">
            <span className="contrib__legend-label">Oba</span>
            <div className="contrib__cell contrib__cell--both-1" />
            <div className="contrib__cell contrib__cell--both-2" />
            <div className="contrib__cell contrib__cell--both-3" />
            <div className="contrib__cell contrib__cell--both-4" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContributionGraph
