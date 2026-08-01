import {
  JOB_CATEGORIES,
  JOB_STYLES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Job,
} from '../lib/jobs'

interface JobPickerProps {
  selectedJobs: Job[]
  onSelectedJobsChange: (jobs: Job[]) => void
  disabled?: boolean
  compact?: boolean
}

export function JobPicker({
  selectedJobs,
  onSelectedJobsChange,
  disabled = false,
  compact = false,
}: JobPickerProps) {
  const playerCount = selectedJobs.length

  const toggleJob = (job: Job) => {
    if (selectedJobs.includes(job)) {
      onSelectedJobsChange(selectedJobs.filter((j) => j !== job))
    } else {
      onSelectedJobsChange([...selectedJobs, job])
    }
  }

  const toggleCategory = (jobs: Job[]) => {
    const allOn = jobs.every((j) => selectedJobs.includes(j))
    if (allOn) {
      onSelectedJobsChange(selectedJobs.filter((j) => !jobs.includes(j)))
    } else {
      const next = new Set(selectedJobs)
      for (const j of jobs) next.add(j)
      onSelectedJobsChange([...next])
    }
  }

  return (
    <div className={`job-picker ${compact ? 'job-picker--compact' : ''}`}>
      <p className="job-picker__count" aria-live="polite">
        人數 <strong>{playerCount}</strong>
        <span>
          （{MIN_PLAYERS}–{MAX_PLAYERS}）
        </span>
      </p>
      <div className="room-lobby__jobs">
        {JOB_CATEGORIES.map((cat) => {
          const allOn = cat.jobs.every((j) => selectedJobs.includes(j))
          return (
            <fieldset key={cat.id} className="room-lobby__cat">
              <legend className="room-lobby__cat-legend">
                <button
                  type="button"
                  className="room-lobby__cat-toggle"
                  disabled={disabled}
                  onClick={() => toggleCategory(cat.jobs)}
                >
                  {cat.label}
                  <span>{allOn ? '全取消' : '全選'}</span>
                </button>
              </legend>
              <div className="room-lobby__job-grid">
                {cat.jobs.map((job) => {
                  const checked = selectedJobs.includes(job)
                  const style = JOB_STYLES[job]
                  return (
                    <label
                      key={job}
                      className={`room-lobby__job ${checked ? 'is-on' : ''}`}
                      style={
                        checked
                          ? {
                              borderColor: style.border,
                              backgroundColor: style.soft,
                            }
                          : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleJob(job)}
                      />
                      <span aria-hidden="true">{style.emoji}</span>
                      <span>{job}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>
      {playerCount > 0 && playerCount < MIN_PLAYERS ? (
        <p className="room-lobby__warn">至少選擇 {MIN_PLAYERS} 個職業</p>
      ) : null}
    </div>
  )
}
