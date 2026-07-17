┌──────────────────────────────────────────────────────────┐
│                    TaskDetailScreen                      │
│                                                          │
│  useStudentTaskDetail(taskId)                            │
│  Owns: loading, errors, manual refresh, page composition │
└────────────────────────────┬─────────────────────────────┘
                             │ explicit props
          ┌──────────────────┼───────────────────┐
          ▼                  ▼                   ▼
 ┌────────────────┐ ┌─────────────────┐ ┌─────────────────┐
 │ Header + Note  │ │ Stats + History │ │ Pomodoro        │
 │ Visual only    │ │ Visual only     │ │ Container       │
 └────────────────┘ └─────────────────┘ └────────┬────────┘
                                                 │
            ┌────────────────────────────────────┼───────────────┐
            ▼                                    ▼               ▼
┌───────────────────────┐          ┌────────────────────┐ ┌──────────────────┐
│ useSessionCountdown   │          │ Session Commands   │ │ Reconciliation   │
│                       │          │                    │ │                  │
│ • Displayed second    │          │ • Start            │ │ • Screen focus   │
│ • Timer interval      │          │ • Pause            │ │ • App resume     │
│ • Pause freeze        │          │ • Resume           │ │ • Refetch        │
│ • Progress            │          │ • Cancel           │ └──────────────────┘
│ • Expiry detection    │          │ • Complete         │
└──────────┬────────────┘          │ • Request lock     │
           │                       │ • Error handling   │
           │                       └──────────┬─────────┘
           │                                  │
           ▼                                  ▼
┌───────────────────────┐          ┌────────────────────┐
│ PomodoroCard          │          │ React Query        │
│                       │          │                    │
│ • Circular timer      │          │ Confirmed task     │
│ • Buttons             │          │ and session state  │
│ • Layout only         │          └──────────┬─────────┘
└───────────────────────┘                     │
                                              ▼
                                   ┌────────────────────┐
                                   │ taskSessionCache   │
                                   │                    │
                                   │ Applies confirmed  │
                                   │ mutation responses │
                                   └──────────┬─────────┘
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │ taskService        │
                                   │ Raw HTTP requests  │
                                   └──────────┬─────────┘
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │ Backend API        │
                                   │ Authoritative data │
                                   └────────────────────┘

                                   
Notification flow is separate:
Confirmed active session
          │
          ▼
useSessionNotification
          │
          ├── running → schedule using expectedEndAt
          └── paused/completed/cancelled → cancel

Pause flow:
Tap Pause
    ↓
Countdown freezes immediately
    ↓
Commands send displayed elapsed time
    ↓
Backend returns confirmed paused session
    ↓
React Query cache updates
    ↓
Countdown displays confirmed durationSeconds

Resume flow:
Tap Resume
    ↓
UI stays paused while request is pending
    ↓
Backend returns running session + expectedEndAt
    ↓
React Query cache updates
    ↓
Countdown starts from confirmed expectedEndAt
The key data direction is now one-way:
Backend → React Query → Container → Countdown → Visual UI