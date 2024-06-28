<script lang="ts">
    import Summary from '$components/patient/Summary.svelte';

    const { data } = $props();
</script>

<h1>{data.patient.phone}</h1>

<Summary patient="{data.patient}" />
