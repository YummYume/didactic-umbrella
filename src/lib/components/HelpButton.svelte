<script lang="ts">
    import * as Tooltip from '$lib/components/ui/tooltip';

    import { driverObj } from '$utils/driver';

    import IconCircleHelp from '~icons/lucide/circle-help';

    import Button from './ui/button/button.svelte';
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder
        ><Button
            aria-label="Lancer la visite guidée"
            builders="{[builder]}"
            onclick="{() => {
                driverObj.drive();
            }}"
            size="icon"
            variant="ghost"
        >
            <IconCircleHelp class="size-6" />
        </Button></Tooltip.Trigger
    >
    <Tooltip.Content>
        <p>Lancer la visite guidée</p>
    </Tooltip.Content>
</Tooltip.Root>
