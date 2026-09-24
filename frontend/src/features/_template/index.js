/**
 * Feature barrel — re-export everything the rest of the app needs.
 * Copy this whole _template folder and rename to your feature name.
 */

export { useTemplate } from './hooks/useTemplate';
export { default as TemplateCard } from './components/TemplateCard';
export { default as TemplateSkeleton } from './components/TemplateSkeleton';
export * as templateApi from './api';
