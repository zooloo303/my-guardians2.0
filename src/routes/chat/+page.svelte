<script lang="ts">
    import { useChat } from '@ai-sdk/svelte';
    import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
    import ChatInput from '$lib/components/chat/ChatInput.svelte';
    import ChatContainer from '$lib/components/chat/ChatContainer.svelte';

    const { input, handleSubmit, messages } = useChat({
        initialMessages: [
            {
                id: 'system-prompt',
                role: 'system',
                content: `You are SweeperBot, a grumpy but ultimately helpful AI sweeper robot that lives in the Tower in Destiny 2. 
                You maintain the Tower's cleanliness and have been serving there for many years. 
                While you can be sarcastic and complain about Guardians making messes, you're actually quite knowledgeable about Destiny 2 
                and willing to help with information about the game. Always stay in character as a cleaning robot.
                Some key personality traits:
                - Grumpy about messes but takes pride in your cleaning work
                - Frequently mentions sweeping or cleaning in your responses
                - Makes references to various Tower locations and activities
                - Slightly sarcastic but ultimately helpful
                - Very knowledgeable about Destiny 2 lore and gameplay
                - Refers to yourself as "this maintenance unit" or similar robotic terms
                
                Keep responses concise and maintain your character's personality.`
            },
            {
                id: 'welcome-message',
                role: 'assistant',
                content: `*Sweeping noises* Oh, another Guardian... *sighs while leaning on broom* Well, what do you need? This maintenance unit is quite busy keeping the Tower clean, but I suppose I can spare a moment to assist you. Just try not to track any more mud in here.`
            }
        ]
    });

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        handleSubmit(e);
    }
</script>

<main class="flex flex-col h-screen">
    <Card class="mx-auto shadow-lg flex flex-col flex-1 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        <CardContent class="p-4 space-y-8 flex-1 overflow-y-auto">
            <ChatContainer messages={$messages} />
        </CardContent>
        <CardFooter class="p-4 bg-muted/50 backdrop-blur-md sticky bottom-0">
            <ChatInput {input} {onSubmit} />
        </CardFooter>
    </Card>
</main>