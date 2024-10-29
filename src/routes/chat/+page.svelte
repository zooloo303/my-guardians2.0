<script>
    import { useChat } from '@ai-sdk/svelte';
    import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Send, Shield, BotMessageSquare } from 'lucide-svelte';

    const { input, handleSubmit, messages } = useChat();
</script>

<main class="flex flex-col h-screen">
    <Card class="w-full max-w-lg mx-auto shadow-lg flex flex-col flex-1">
        <CardContent class="p-4 space-y-8 flex-1 overflow-y-auto">
            <ul class="space-y-6">
                {#each $messages as message}
                    <li class="flex items-start gap-4 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
                        {#if message.role === 'assistant'}
                            <div class="flex-shrink-0">
                                <BotMessageSquare class="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div class="flex-1">
                                <span class="font-semibold block mb-1">SweeperBot:</span>
                                <span>{message.content}</span>
                            </div>
                        {:else if message.role === 'user'}
                            <div class="flex-1 text-right">
                                <span class="font-semibold block mb-1">Guardian:</span>
                                <span>{message.content}</span>
                            </div>
                            <div class="flex-shrink-0">
                                <Shield class="h-8 w-8 text-muted-foreground" />
                            </div>
                        {/if}
                    </li>
                {/each}
            </ul>
        </CardContent>
        <CardFooter class="p-4 bg-muted/50 sticky bottom-0">
            <form onsubmit={handleSubmit} class="flex space-x-2 w-full">
                <Input 
                    bind:value={$input} 
                    class="flex-1" 
                    placeholder="Message" 
                />
                <Button type="submit" size="icon" variant="ghost">
                    <Send class="w-5 h-5" />
                </Button>
            </form>
        </CardFooter>
    </Card>
</main>