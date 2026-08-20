import { Divider } from './Divider'

export function Input({ prefix, suffix, ...rest }) {
  return (
    <div className="bg-input flex items-center rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      {prefix && (
        <>
          <span className="text-muted-foreground text-sm font-medium">
            {prefix}
          </span>
          <Divider orientation="vertical" />
        </>
      )}
      <input
        className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        autoFocus
        {...rest}
      />
      {suffix && (
        <>
          <Divider orientation="vertical" />
          <span className="text-muted-foreground ml-3 text-sm font-medium">
            {suffix}
          </span>
        </>
      )}
    </div>
  )
}
