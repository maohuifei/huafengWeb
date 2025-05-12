declare module 'markdown-it-emoji' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginSimple;
    export default plugin;
}

declare module 'markdown-it-sub' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginSimple;
    export default plugin;
}

declare module 'markdown-it-sup' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginSimple;
    export default plugin;
}

declare module 'markdown-it-footnote' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginSimple;
    export default plugin;
}

declare module 'markdown-it-task-lists' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginSimple;
    export default plugin;
}

declare module 'markdown-it-anchor' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginWithOptions<{
        permalink?: boolean;
        permalinkBefore?: boolean;
        permalinkSymbol?: string;
    }>;
    export default plugin;
}

declare module 'markdown-it-toc-done-right' {
    import MarkdownIt from 'markdown-it';
    const plugin: MarkdownIt.PluginWithOptions<{
        level?: number[];
        listType?: string;
        containerClass?: string;
    }>;
    export default plugin;
} 