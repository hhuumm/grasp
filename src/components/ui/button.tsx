import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import Link from 'next/link'

const styles = {
  base: [
    // Base
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-full border text-base/6 font-semibold',
    // Sizing
    'px-[calc(theme(spacing.4)-1px)] py-[calc(theme(spacing.2.5)-1px)] sm:px-[calc(theme(spacing.4)-1px)] sm:py-[calc(theme(spacing.2)-1px)] sm:text-sm/6',
    // Focus
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-[var(--primary)]',
    // Disabled
    'data-disabled:opacity-50',
    // Icon
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4',
    // Transitions
    'transition-all duration-200 hover:scale-105 active:scale-95',
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-[var(--btn-border)]',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-[var(--btn-bg)]',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-[var(--btn-bg)]',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.lg)-1px)]',
    // Inner highlight shadow
    'after:shadow-[inset_0_1px_theme(colors.white/15%)]',
    // White overlay on hover
    'data-active:after:bg-[var(--btn-hover-overlay)] data-hover:after:bg-[var(--btn-hover-overlay)]',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-lg',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    // Base
    'border-zinc-950/10 text-zinc-950 data-active:bg-zinc-950/2.5 data-hover:bg-zinc-950/2.5',
    // Dark mode
    'dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
  ],
  plain: [
    // Base
    'border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5',
    // Dark mode
    'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
  ],
  colors: {
    primary: [
      'text-white [--btn-bg:var(--primary)] [--btn-border:var(--primary)] [--btn-hover-overlay:var(--color-white)]/10',
      'dark:[--btn-hover-overlay:var(--color-white)]/5',
    ],
    secondary: [
      'text-zinc-950 [--btn-bg:var(--secondary)] [--btn-border:var(--secondary)] [--btn-hover-overlay:var(--color-zinc-950)]/2.5',
      'dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5',
    ],
    success: [
      'text-white [--btn-bg:var(--success)] [--btn-border:var(--success)] [--btn-hover-overlay:var(--color-white)]/10',
    ],
    warning: [
      'text-white [--btn-bg:var(--warning)] [--btn-border:var(--warning)] [--btn-hover-overlay:var(--color-white)]/10',
    ],
    error: [
      'text-white [--btn-bg:var(--error)] [--btn-border:var(--error)] [--btn-hover-overlay:var(--color-white)]/10',
    ],
    dark: [
      'text-white [--btn-bg:theme(colors.zinc.900)] [--btn-border:theme(colors.zinc.950)]/90 [--btn-hover-overlay:var(--color-white)]/10',
      'dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:theme(colors.zinc.800)]',
    ],
    light: [
      'text-zinc-950 [--btn-bg:white] [--btn-border:theme(colors.zinc.950)]/10 [--btn-hover-overlay:theme(colors.zinc.950)]/2.5',
      'dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:theme(colors.zinc.800)]',
    ],
  },
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  )

export const Button = forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    styles.base,
    outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? 'primary'])
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}
