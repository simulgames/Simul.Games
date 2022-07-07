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
		adapter: adapter(),
		routes: filepath => {
			return ![
				// exclude *test.js files
				/\.test\.ts$/,

				// original default config
				/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/,
			].some(regex => regex.test(filepath))
		},
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
