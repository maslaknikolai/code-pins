import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/utils/cn"

function TooltipProvider({
	delayDuration = 300,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			disableHoverableContent
			{...props}
		/>
	)
}

function TooltipRoot({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function Tooltip({ body, children }: { body: React.ReactNode; children: React.ReactNode }) {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>{body}</TooltipContent>
		</TooltipRoot>
	)
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
	className,
	sideOffset = 4,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					"z-50 w-fit rounded border border-(--vscode-editorHoverWidget-border) bg-(--vscode-editorHoverWidget-background) px-2 py-1 text-xs text-balance text-(--vscode-editorHoverWidget-foreground) shadow",
					className
				)}
				{...props}
			>
				{children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}

export { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }
