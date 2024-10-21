<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	type $$Props = import('./index.js').Props & {
		duration?: number;
	};
	type $$Events = import('./index.js').Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export let duration = 1500; // Default duration of 1.5 seconds
	export { className as class };

	let progress = tweened(0, {
		duration,
		easing: cubicOut
	});
	let isHolding = false;

	function onMouseDown() {
		isHolding = true;
		progress.set(100);
	}

	function onMouseUp() {
		isHolding = false;
		progress.set(0);
	}

	$: if ($progress === 100 && isHolding) {
		const event = new CustomEvent('click');
		dispatchEvent(event);
		isHolding = false;
	}
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
	type="button"
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mouseleave={onMouseUp}
	on:touchstart={onMouseDown}
	on:touchend={onMouseUp}
	on:touchcancel={onMouseUp}
	{...$$restProps}
	on:click
	on:keydown
>
	<div class="relative z-10">
		<slot />
	</div>
	<div
		class="absolute inset-0 bg-primary-foreground opacity-25 transition-transform origin-left"
		style="transform: scaleX({$progress / 100});"
	></div>
</ButtonPrimitive.Root>
