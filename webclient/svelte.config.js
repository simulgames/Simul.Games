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
	}
}

export default config;
