<script lang="ts">
    import { Send } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    
    let { input, onSubmit } = $props<{
        input: { subscribe: any; set: any };
        onSubmit: (e: SubmitEvent) => void;
    }>();
</script>

<form 
    onsubmit={onSubmit} 
    class="flex space-x-2 w-full"
>
    <Input 
        value={$input}
        oninput={(e) => input.set(e.currentTarget.value)}
        class="flex-1" 
        placeholder="Message" 
    />
    <Button type="submit" size="icon" variant="ghost">
        <Send class="w-5 h-5" />
    </Button>
</form>