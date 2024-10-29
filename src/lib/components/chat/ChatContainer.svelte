<script lang="ts">
    import ChatMessage from './ChatMessage.svelte';
    
    let { messages } = $props<{
        messages: Array<{
            role: 'user' | 'assistant';
            content: string;
        }>;
    }>();
</script>

<ul class="space-y-6">
    {#each messages as message}
        <li>
            <ChatMessage {message} />
        </li>
    {/each}
</ul> 