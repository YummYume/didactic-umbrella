<script lang="ts">
    import { page } from '$app/stores';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Actions } from '$lib/enums/actions';

    import { BASE_STEPS, driverjs, ROUTE_STEPS } from '$utils/driver';

    import IconCircleHelp from '~icons/lucide/circle-help';

    import Button from './ui/button/button.svelte';

    let dialogOpen = $state(false);
</script>

<Dialog.Root bind:open="{dialogOpen}">
    <Dialog.Trigger asChild let:builder="{dialogBuilder}">
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder="{tooltipBuilder}">
                <Button
                    aria-label="{Actions.Help}"
                    builders="{[dialogBuilder, tooltipBuilder]}"
                    size="icon"
                    variant="ghost"
                    on:click="{() => (dialogOpen = true)}"
                >
                    <IconCircleHelp class="size-6" />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>{Actions.Help}</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Visite guidée</Dialog.Title>
            <Dialog.Description>
                La visite guidée vous expliquera les différentes fonctionnalités de l'application.
            </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
            <Button
                on:click="{() => {
                    dialogOpen = false;
                    driverjs.setSteps([...BASE_STEPS, ...(ROUTE_STEPS[$page.url.pathname] ?? [])]);
                    driverjs.drive();
                }}"
            >
                {Actions.Help}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
