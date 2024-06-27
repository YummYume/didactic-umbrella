<script lang="ts">
    import 'driver.js/dist/driver.css';

    import { page } from '$app/stores';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Pagination from '$lib/components/ui/pagination';
    import * as Select from '$lib/components/ui/select/index.js';
    import * as Table from '$lib/components/ui/table/index.js';
    import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Actions } from '$lib/enums/actions';
    import { Status } from '$lib/enums/status';

    import Button from '$components/ui/button/button.svelte';
    import Separator from '$components/ui/separator/separator.svelte';
    import { driverjs } from '$utils/driver';

    import IconUnexpected from '~icons/heroicons/bell-alert-solid';
    import IconPending from '~icons/heroicons/chat-bubble-oval-left-ellipsis-solid';
    import IconOk from '~icons/heroicons/check-circle-solid';
    import IconunReachable from '~icons/heroicons/phone-x-mark-solid';
    import IconCheck from '~icons/lucide/check';
    import IconChevronLeft from '~icons/lucide/chevron-left';
    import IconChevronRight from '~icons/lucide/chevron-right';
    import IconDownload from '~icons/lucide/download';
    import IconSearch from '~icons/lucide/search';
    import IconUpload from '~icons/lucide/upload';
    import IconUserPlus from '~icons/lucide/user-plus';
    import IconX from '~icons/lucide/x';

    const rows = [
        {
            date: '24/06/2024 07:00:00',
            firstname: 'John',
            name: 'Doe',
            smsTracking: true,
            status: '',
            step: 'J+1',
            tel: '07 89 71 49 59',
        },
        {
            date: '09/02/2024 07:00:00',
            firstname: 'John',
            name: 'Doe',
            smsTracking: true,
            status: Status.Unexpected,
            step: '',
            tel: '07 89 71 49 59',
        },
        {
            date: '24/06/2024 07:00:00',
            firstname: 'John',
            name: 'Doe',
            smsTracking: true,
            status: Status.Pending,
            step: 'J0',
            tel: '07 89 71 49 59',
        },
        {
            date: '09/02/2024 07:00:00',
            firstname: 'Jane',
            name: 'Doe',
            smsTracking: false,
            status: Status.Unreachable,
            step: 'J-5',
            tel: '01 85 09 01 81',
        },
    ];

    const perPages = [10, 25, 50, 100];

    const tabs = [
        {
            href: '/admin/answers',
            label: 'Memoquest',
        },
        {
            href: '/admin',
            label: 'Tous',
        },
        {
            href: '/admin/j-5',
            label: 'J-5',
        },
        {
            href: '/admin/j-2',
            label: 'J-2',
        },
        {
            href: '/admin/j-1',
            label: 'J-1',
        },
        {
            href: '/admin/j0',
            label: 'J0',
        },
        {
            href: '/admin/j1',
            label: 'J+1',
        },
        {
            href: '/admin/j4',
            label: 'J+4',
        },
        {
            href: '/admin/j7',
            label: 'J+7',
        },
        {
            href: '/admin/j2000',
            label: 'J+2000',
        },
    ];

    $effect(() => {
        if (document.cookie.includes('visited')) {
            return;
        }

        driverjs.drive();

        document.cookie = 'visited=true';
    });
</script>

<div class="container">
    <ul class="flex flex-wrap gap-3 py-4">
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{Actions.Enrole}" builders="{[builder]}" size="icon"
                        ><IconUserPlus class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{Actions.Enrole}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </li>
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{Actions.Import}" builders="{[builder]}" size="icon"
                        ><IconUpload class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{Actions.Import}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </li>
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{Actions.Download}" builders="{[builder]}" size="icon"
                        ><IconDownload class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{Actions.Download}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </li>
        <li class="sm:mx-auto">
            <div class="flex gap-2.5">
                <Label class="sr-only" for="search">Recherche</Label>
                <Input
                    class="max-w-sm"
                    type="search"
                    id="search"
                    placeholder="Nom, prénom, tél..."
                />
                <Button aria-label="Rechercher" class="shrink-0" size="icon"
                    ><IconSearch class="size-6" /></Button
                >
            </div>
        </li>
        <li>
            <ToggleGroup.Root type="multiple" variant="outline">
                <ToggleGroup.Item value="{Status.Ok}" aria-label="Basculer statut OK">
                    <IconOk class="size-4 text-neutral-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item value="{Status.Pending}" aria-label="Basculer statut innatendu">
                    <IconPending class="size-4 text-yellow-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="{Status.Unexpected}"
                    aria-label="Basculer statut en attente"
                >
                    <IconUnexpected class="size-4 text-orange-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="{Status.Unreachable}"
                    aria-label="Basculer statut non-accessible"
                >
                    <IconunReachable class="size-4 text-blue-500" />
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        </li>
    </ul>

    <ul
        class="grid h-10 w-full grid-cols-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
        id="tabs"
    >
        {#each tabs as tab}
            <li class="contents">
                <a
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 {tab.href ===
                    $page.url.pathname
                        ? 'bg-background text-foreground shadow-sm'
                        : ''}"
                    href="/admin">{tab.label}</a
                >
            </li>
        {/each}
    </ul>

    <Table.Root>
        <Table.Caption class="sr-only">La liste des clients.</Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[100px]"></Table.Head>
                <Table.Head>Etape</Table.Head>
                <Table.Head>Prénom</Table.Head>
                <Table.Head>Nom</Table.Head>
                <Table.Head>Mobile</Table.Head>
                <Table.Head>Suivi SMS</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each rows as row, i (i)}
                <Table.Row>
                    <Table.Cell class="font-medium">
                        {#if row.status === Status.Pending}
                            <IconPending class="size-5 text-yellow-500" />
                        {:else if row.status === Status.Unexpected}
                            <IconUnexpected class="size-5 text-orange-500" />
                        {:else if row.status === Status.Unreachable}
                            <IconunReachable class="size-5 text-blue-500" />
                        {/if}
                    </Table.Cell>
                    <Table.Cell>{row.step}</Table.Cell>
                    <Table.Cell>{row.firstname}</Table.Cell>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>{row.tel}</Table.Cell>
                    <Table.Cell
                        >{#if row.smsTracking}
                            <IconCheck class="size-7 text-teal-500" />
                        {:else}
                            <IconX class="size-7 text-red-500" />
                        {/if}</Table.Cell
                    >
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>

    <Separator />

    <div class="mt-8 grid items-center gap-2.5 sm:flex">
        <Select.Root portal="{null}">
            <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Eléments par page" />
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each perPages as perPage}
                        <Select.Item
                            value="{perPage}"
                            label="{perPage.toString()} éléments par page"
                            >{perPage} par page</Select.Item
                        >
                    {/each}
                </Select.Group>
            </Select.Content>
            <Select.Input name="favoriteFruit" />
        </Select.Root>

        <Pagination.Root count="{100}" perPage="{10}" let:pages let:currentPage>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.PrevButton>
                        <IconChevronLeft class="size-4" />
                        <span class="hidden sm:block">Précédent</span>
                    </Pagination.PrevButton>
                </Pagination.Item>

                {#each pages as page (page.key)}
                    {#if page.type === 'ellipsis'}
                        <Pagination.Item>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    {:else}
                        <Pagination.Item>
                            <Pagination.Link {page} isActive="{currentPage === page.value}">
                                {page.value}
                            </Pagination.Link>
                        </Pagination.Item>
                    {/if}
                {/each}

                <Pagination.Item>
                    <Pagination.NextButton>
                        <span class="hidden sm:block">Suivant</span>
                        <IconChevronRight class="size-4" />
                    </Pagination.NextButton>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination.Root>
    </div>
</div>
