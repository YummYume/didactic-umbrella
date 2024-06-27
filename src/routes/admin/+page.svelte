<script lang="ts">
    import 'driver.js/dist/driver.css';

    import { driver } from 'driver.js';
    import { onMount } from 'svelte';

    import { page } from '$app/stores';
    import * as Pagination from '$lib/components/ui/pagination';
    import * as Select from '$lib/components/ui/select/index.js';
    import * as Table from '$lib/components/ui/table/index.js';
    import * as Tooltip from '$lib/components/ui/tooltip';

    import Button from '$components/ui/button/button.svelte';
    import Separator from '$components/ui/separator/separator.svelte';

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

    const perPages = [10, 25, 50, 100];

    const buttonsLabel = {
        enrole: 'Enrôler un patient',
        download: 'Télécharger le tableau',
        import: 'Importer des fichiers',
    };

    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

    const STATUS_OK = 'ok';
    const STATUS_PENDING = 'pending';
    const STATUS_UNEXPECTED = 'unexpected';
    const STATUS_UNREACHABLE = 'unreachable';

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
            status: STATUS_UNEXPECTED,
            step: '',
            tel: '07 89 71 49 59',
        },
        {
            date: '24/06/2024 07:00:00',
            firstname: 'John',
            name: 'Doe',
            smsTracking: true,
            status: STATUS_PENDING,
            step: 'J0',
            tel: '07 89 71 49 59',
        },
        {
            date: '09/02/2024 07:00:00',
            firstname: 'Jane',
            name: 'Doe',
            smsTracking: false,
            status: STATUS_UNREACHABLE,
            step: 'J-5',
            tel: '01 85 09 01 81',
        },
    ];

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

    onMount(() => {
        const driverObj = driver({
            doneBtnText: 'Terminé',
            nextBtnText: 'Suivant',
            popoverClass: 'driverjs-theme',
            prevBtnText: 'Précédent',
            showProgress: true,
            steps: [
                {
                    element: `[aria-label="${buttonsLabel.enrole}"]`,
                    popover: {
                        title: buttonsLabel.enrole,
                        description: 'Enrôlez un patient en cliquant sur ce bouton.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[aria-label="${buttonsLabel.import}"]`,
                    popover: {
                        title: buttonsLabel.import,
                        description: 'Importez un ou plusieurs fichiers en cliquant sur ce bouton.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[aria-label="${buttonsLabel.download}"]`,
                    popover: {
                        title: buttonsLabel.download,
                        description: 'Téléchargez le contenu du tableau en cliquant sur ce bouton.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: ':has(>[type="search"])',
                    popover: {
                        title: 'Recherche',
                        description:
                            "Entrez n'importe quel mot(s) clé(s) pour filtrer les résultats du tableau.",
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '[data-toggle-group-root]',
                    popover: {
                        title: 'Indicateurs de statut',
                        description:
                            'Par défaut, tous les statuts sont affichés. Cliquez sur une icône pour filtrer les résultats par statut.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[data-toggle-group-root] [data-value="${STATUS_OK}"]`,
                    popover: {
                        title: 'Coche grise',
                        description: 'La demande du patient a bien été traitée.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[data-toggle-group-root] [data-value="${STATUS_PENDING}"]`,
                    popover: {
                        title: 'Bulle jaune',
                        description:
                            "Le patient a répondu à une question qu'on lui a posé manuellement, ou il a envoyé un document.",
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[data-toggle-group-root] [data-value="${STATUS_UNEXPECTED}"]`,
                    popover: {
                        title: 'Cloche orange',
                        description:
                            "Le patient ne va pas bien, ou sa réponse n'a pas étée comprise.",
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: `[data-toggle-group-root] [data-value="${STATUS_UNREACHABLE}"]`,
                    popover: {
                        title: 'Téléphone bleu',
                        description:
                            'Le suivi est impossible par SMS car le numéro de téléphone du patient est invalide, ou alors un problème technique interne est survenu.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '#tabs',
                    popover: {
                        title: 'Onglets',
                        description:
                            'Utilisez les onglets pour afficher uniquement les résultats à une étape spécifique (ou toutes).',
                        side: 'left',
                        align: 'start',
                    },
                },
            ],
        });

        driverObj.drive();
    });
</script>

<div class="container">
    <ul class="flex flex-wrap gap-3 py-4">
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{buttonsLabel.enrole}" builders="{[builder]}" size="icon"
                        ><IconUserPlus class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{buttonsLabel.enrole}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </li>
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{buttonsLabel.import}" builders="{[builder]}" size="icon"
                        ><IconUpload class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{buttonsLabel.import}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </li>
        <li>
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder
                    ><Button aria-label="{buttonsLabel.download}" builders="{[builder]}" size="icon"
                        ><IconDownload class="size-6" /></Button
                    ></Tooltip.Trigger
                >
                <Tooltip.Content>
                    <p>{buttonsLabel.download}</p>
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
                <ToggleGroup.Item value="{STATUS_OK}" aria-label="Basculer statut OK">
                    <IconOk class="size-4 text-neutral-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item value="{STATUS_PENDING}" aria-label="Basculer statut innatendu">
                    <IconPending class="size-4 text-yellow-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="{STATUS_UNEXPECTED}"
                    aria-label="Basculer statut en attente"
                >
                    <IconUnexpected class="size-4 text-orange-500" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="{STATUS_UNREACHABLE}"
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
                        {#if row.status === STATUS_PENDING}
                            <IconPending class="size-5 text-yellow-500" />
                        {:else if row.status === STATUS_UNEXPECTED}
                            <IconUnexpected class="size-5 text-orange-500" />
                        {:else if row.status === STATUS_UNREACHABLE}
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
