<script lang="ts">
    import { Shield, BotMessageSquare } from 'lucide-svelte';
    
    let { message } = $props<{
        message: {
            role: 'user' | 'assistant';
            content: string;
        }
    }>();
</script>

<div class="flex items-start gap-4 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
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
</div> 