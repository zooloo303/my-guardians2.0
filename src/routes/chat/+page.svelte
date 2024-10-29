<script lang="ts">
    import { useChat } from '@ai-sdk/svelte';
    import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
    import ChatInput from '$lib/components/chat/ChatInput.svelte';
    import ChatContainer from '$lib/components/chat/ChatContainer.svelte';

    const { input, handleSubmit, messages } = useChat();

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        handleSubmit(e);
    }
</script>

<main class="flex flex-col h-screen">
    <Card class="w-full max-w-lg mx-auto shadow-lg flex flex-col flex-1">
        <CardContent class="p-4 space-y-8 flex-1 overflow-y-auto">
            <ChatContainer messages={$messages} />
        </CardContent>
        <CardFooter class="p-4 bg-muted/50 sticky bottom-0">
            <ChatInput {input} {onSubmit} />
        </CardFooter>
    </Card>
</main>