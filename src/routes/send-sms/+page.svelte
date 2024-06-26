<script lang="ts">
    import { enhance } from '$app/forms';
    import Input from '$components/ui/input/input.svelte';
    import Textarea from '$components/ui/textarea/textarea.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<div>
    <h1>Envoyer un sms</h1>
    <form method="post" action="?/send" use:enhance>
        <label for="phone">Numéro de téléphone</label>
        <Input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Votre numéro de téléphone"
            required
        />
        <label for="message">Message</label>
        <Textarea name="message" id="message" placeholder="Votre message.." required />
        <button type="submit">Envoyer</button>
    </form>

    {#if form?.message}
        <p>{form.message}</p>
    {/if}
</div>
