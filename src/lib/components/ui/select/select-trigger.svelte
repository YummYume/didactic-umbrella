<script lang="ts">
    import { Select as SelectPrimitive } from 'bits-ui';

    import { cn } from '$lib/utils.js';

    import ChevronDown from '~icons/lucide/chevron-down';

    type $$Props = SelectPrimitive.TriggerProps;

    let className: $$Props['class'] = undefined;
    export { className as class };
</script>

<SelectPrimitive.Trigger
    class="{cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background aria-[invalid]:border-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground',
        className,
    )}"
    {...$$restProps}
    let:builder
    on:click
    on:keydown
>
    <slot {builder} />
    <div>
        <ChevronDown class="h-4 w-4 opacity-50" />
    </div>
</SelectPrimitive.Trigger>
