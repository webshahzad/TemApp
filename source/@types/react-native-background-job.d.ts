declare module 'react-native-background-job' {
  export function register(options: RegisterOptions): void

  export function schedule(option: ScheduleOptions): Promise<void>

  export function cancel(option: CancelOptions): Promise<void>

  export function cancelAll(): Promise<void>

  export function setGlobalWarnings(warn: boolean): void

  export function isAppIgnoringBatteryOptimization(callback: (err: string, isIgnoring: boolean) => void): Promise<boolean>

  interface CancelOptions {
    jobKey: string
  }

  interface RegisterOptions extends CancelOptions {
    job: () => (Promise<void> | void)
  }

  interface ScheduleOptions extends CancelOptions {
    timeout?: number
    period?: number
    persist?: boolean
    override?: boolean
    networkType?: number
    requiresCharging?: boolean
    requiresDeviceIdle?: boolean
    exact?: boolean
    allowWhileIdle?: boolean
    allowExecutionInForeground?: boolean
    notificationText?: string
    notificationTitle?: string
  }
}
