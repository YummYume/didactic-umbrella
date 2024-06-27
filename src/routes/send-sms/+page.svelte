<script lang="ts">
    import { toast } from 'svelte-sonner';

    import { enhance } from '$app/forms';

    import Input from '$components/ui/input/input.svelte';
    import Textarea from '$components/ui/textarea/textarea.svelte';

    let isSubmit = $state(false);
</script>

<div>
    <h1>Envoyer un sms</h1>
    <form
        method="post"
        action="?/send"
        use:enhance="{({ cancel }) => {
            if (isSubmit) {
                cancel();
                return;
            }

            isSubmit = true;

            return async ({ update, result }) => {
                await update();
                isSubmit = false;

                console.log(result);

                if (result.type === 'success') {
                    toast.success('Message envoyé avec succès');
                }

                if (result.type === 'failure') {
                    if (result.data?.error) {
                        toast.error(result.data.error as string);
                    }
                }
            };
        }}"
    >
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
        <button type="submit" disabled="{isSubmit}"
            >{isSubmit ? 'envoi en cours..' : 'envoyer'}</button
        >
    </form>
</div>
