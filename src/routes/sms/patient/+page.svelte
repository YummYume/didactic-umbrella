<script lang="ts">
    import { toast } from 'svelte-sonner';

    import { enhance } from '$app/forms';

    import Button from '$components/ui/button/button.svelte';
    import Input from '$components/ui/input/input.svelte';
    import Textarea from '$components/ui/textarea/textarea.svelte';

    let isSubmitting = $state(false);
</script>

<div class="m-auto flex min-h-full max-w-[600px] flex-col justify-center px-6 py-12 lg:px-8">
    <h1
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100"
    >
        Envoyer un sms
    </h1>
    <form
        method="post"
        action="?/send"
        aria-busy="{isSubmitting}"
        class="container mt-10 flex flex-col gap-6"
        use:enhance="{({ cancel }) => {
            if (isSubmitting) {
                cancel();

                return;
            }

            isSubmitting = true;

            return async ({ update, result }) => {
                await update();

                isSubmitting = false;

                if (result.type === 'success') {
                    if (result.data?.success) {
                        toast.success(result.data.success as string);
                    }
                }

                if (result.type === 'failure') {
                    if (result.data?.error) {
                        toast.error(result.data.error as string);
                    }
                }
            };
        }}"
    >
        <label class="space-y-2" for="phone">
            <span>Numéro de téléphone</span>
            <Input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Votre numéro de téléphone"
                required
            />
        </label>
        <label class="space-y-2" for="message">
            <span>Message</span>
            <Textarea name="message" id="message" placeholder="Votre message.." required />
        </label>
        <Button type="submit" disabled="{isSubmitting}" class="w-fit self-center">
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </Button>
    </form>
</div>
