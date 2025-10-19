import React, { useState } from "react"

const TagFilter = ({ tags, selectedTags, onTagToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <h3>Filtry</h3>
        <div className="tag-filter-controls">
          {selectedTags.length > 0 && (
            <button className="clear-filters" onClick={() => onTagToggle(null)}>
              Vymazat filtry
            </button>
          )}
          <button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? "Zobrazit všechny" : "Skrýt"}
          </button>
        </div>
      </div>

      {isCollapsed && selectedTags.length > 0 && (
        <div className="selected-tags">
          {tags
            .filter(tag => selectedTags.includes(tag))
            .map(tag => (
              <button
                key={tag}
                className="tag-button active"
                onClick={() => onTagToggle(tag)}
                aria-pressed="true"
              >
                {tag}
              </button>
            ))}
        </div>
      )}

      {!isCollapsed && (
        <div className="tag-list">
          {tags.map(tag => (
            <button
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? "active" : ""}`}
              onClick={() => onTagToggle(tag)}
              aria-pressed={selectedTags.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagFilter