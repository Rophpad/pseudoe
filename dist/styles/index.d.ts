/**
 * Central styles index for pseudoe
 *
 * Re-exports individual style modules and aggregates them into a single
 * read-only `STYLES` collection.
 *
 * Keep this file minimal — each style's word lists live in their own module.
 */
/**
 * STYLES
 *
 * Aggregated, read-only mapping of style name -> style data.
 */
export declare const STYLES: {
    readonly african: {
        readonly adjectives: readonly ["kola", "sunu", "ogun", "zola", "kwame", "mansa", "nuru", "safari", "bantu", "mbali", "sankofa", "ubuntu", "kilele", "pembe", "rafiki", "umbra"];
        readonly nouns: readonly ["baobab", "kora", "yoruba", "ashanti", "sahara", "lagos", "okonkwo", "benin", "savanna", "delta", "mamba", "kilimanjaro", "marimba", "tamasha", "nyama", "djembe"];
    };
    readonly fruits: {
        readonly adjectives: readonly ["ripe", "sweet", "golden", "juicy", "wild", "tart", "zesty", "fuzzy", "candied", "sunny", "blushing", "succulent", "crisp", "nectar", "luscious", "fragrant"];
        readonly nouns: readonly ["mango", "papaya", "guava", "banana", "pineapple", "fig", "date", "soursop", "berry", "plum", "apricot", "kiwi", "citrus", "pear", "grape", "pomelo"];
    };
    readonly galaxy: {
        readonly adjectives: readonly ["andromeda", "nebula", "quantum", "solar", "lunar", "cosmic", "stellar", "orbital", "interstellar", "celestial", "pulsar", "eclipse", "aurora", "gravity", "hyper", "nova"];
        readonly nouns: readonly ["walker", "rider", "drifter", "seeker", "voyager", "pilot", "mancer", "nomad", "navigator", "warden", "sentinel", "mariner", "warden", "exile", "strider", "ranger"];
    };
    readonly insect: {
        readonly adjectives: readonly ["winged", "tiny", "glint", "hive", "striped", "silent", "swift", "glimmer", "iridescent", "spotted", "velvet", "luminous", "flutter", "nocturnal", "bristled", "whisper"];
        readonly nouns: readonly ["ant", "beetle", "moth", "dragonfly", "firefly", "grasshopper", "cicada", "wasp", "cricket", "locust", "ladybird", "silkmoth", "mayfly", "katydid", "stickbug", "honeypot"];
    };
};
/**
 * StyleName
 *
 * Union of available style keys (e.g. 'african' | 'fruits' | ...).
 */
export type StyleName = keyof typeof STYLES;
/**
 * Style type
 *
 * Useful when typing consumers that need adjective/noun lists.
 */
export type Style = typeof STYLES[StyleName];
/**
 * Default export for convenience.
 */
export default STYLES;
