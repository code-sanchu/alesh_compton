<script lang="ts" context="module">
	import { CalcMaxDimensions, Image } from '$lib/components';
	import type { Image as Data } from '^data/portfolio';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
</script>

<script lang="ts">
	export let data: Data['image'];
	export let id: string;
	export let loading: 'eager' | 'lazy';

	let transformStatus: 'idle' | 'opening' | 'open' | 'closing' = 'idle';

	const [sendImg, receiveImg] = crossfade({
		duration: 1200,
		easing: quintOut,
		delay: 0
	});

	const handleOpenImage = () => {
		transformStatus = 'opening';

		setTimeout(() => {
			if (transformStatus === 'opening') {
				transformStatus = 'open';
			}
		}, 1200);
	};

	const handleCloseImage = () => {
		transformStatus = 'closing';

		setTimeout(() => {
			if (transformStatus === 'closing') {
				transformStatus = 'idle';
			}
		}, 1200);
	};

	let screenWidth: number;
	let screenHeight: number;

	let transformedDimensions: { width: number; height: number };
</script>

<CalcMaxDimensions
	initial={{ width: data.img.w, height: data.img.h }}
	bind:transformed={transformedDimensions}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="shrink-0 w-full md:w-[50vw] xl:w-auto xl:h-[60vh] xl:min-h-[600px] min-w-[300px] relative bg-gray-50"
	style:aspect-ratio={data.img.w / data.img.h}
>
	{#if transformStatus === 'idle' || transformStatus === 'closing'}
		<div
			class="absolute w-full h-full cursor-zoom-in"
			on:click={() => {
				if (transformStatus === 'idle' || transformStatus === 'closing') {
					handleOpenImage();
				} else {
					handleCloseImage();
				}
			}}
			in:receiveImg={{ key: id }}
			out:sendImg={{ key: id }}
		>
			<Image meta={data} imageClass="h-full w-full" {loading} />
		</div>
	{:else}
		<div
			class="fixed inset-0 grid place-items-center z-40 bg-white cursor-zoom-out"
			on:click={handleCloseImage}
			transition:fade
		>
			<div
				class="relative"
				style:height="{transformedDimensions.height}px"
				style:width="{transformedDimensions.width}px"
				in:receiveImg={{ key: id }}
				out:sendImg={{ key: id }}
			>
				<Image meta={data} imageClass="h-full w-full" />
			</div>
		</div>
	{/if}
</div>
