<script lang="ts">
    import type { PageData } from './$types';

    const { patient }: PageData = $props();
</script>

<h1>{patient.phone}</h1>
