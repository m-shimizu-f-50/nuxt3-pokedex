<script setup lang="ts">
import { useCounterStore } from '~/stores/counterStore';
const counterStore = useCounterStore();
</script>
<template>
	<div>
		<h1 class="text-2xl font-bold">
			{{ counterStore.count }}
		</h1>
	</div>
</template>
