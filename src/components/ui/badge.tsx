import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { TouchTarget } from './button'
import Link from 'next/link'

const colors = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)] group-data-hover:bg-[var(--primary)]/25 dark:bg-[var(--primary)]/10 dark:text-[var(--primary)] dark:group-data-hover:bg-[var(--primary)]/20',
  secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)] group-data-hover:bg-[var(--secondary)]/25 dark:bg-[var(--secondary)]/10 dark:text-[var(--secondary)] dark:group-data-hover:bg-[var(--secondary)]/20',
  success: 'bg-[var(--success)]/15 text-[var(--success)] group-data-hover:bg-[var(--success)]/25 dark:bg-[var(--success)]/10 dark:text-[var(--success)] dark:group-data-hover:bg-[var(--success)]/20',
  warning: 'bg-[var(--warning)]/15 text-[var(--warning)] group-data-hover:bg-[var(--warning)]/25 dark:bg-[var(--warning)]/10 dark:text-[var(--warning)] dark:group-data-hover:bg-[var(--warning)]/20',
  error: 'bg-[var(--error)]/15 text-[var(--error)] group-data-hover:bg-[var(--error)]/25 dark:bg-[var(--error)]/10 dark:text-[var(--error)] dark:group-data-hover:bg-[var(--error)]/20',
  zinc: 'bg-zinc-600/10 text-zinc-700 group-data-hover:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-hover:bg-white/10',
}

type BadgeProps = { color?: keyof typeof colors }

export function Badge({ color = 'zinc', className, ...props }: BadgeProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline',
        colors[color]
      )}
    />
  )
}

export const BadgeButton = forwardRef(function BadgeButton(
  {
    color = 'zinc',
    className,
    children,
    ...props
  }: BadgeProps & { className?: string; children: React.ReactNode } & (
      | Omit<Headless.ButtonProps, 'as' | 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    'group relative inline-flex rounded-full focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-[var(--primary)]'
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </Headless.Button>
  )
})
