import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss:true
	}),

	kit: {
		adapter: adapter({ platform: 'node' }),

		vite: {
			test: {
				environment: "jsdom",
				globals: true, // required or setupTests will say expect is undefined -- however, discouraged
				setupFiles: "src/setupTests.ts"
			},
		},
	}
}

export default config;
