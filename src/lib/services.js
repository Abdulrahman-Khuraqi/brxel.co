import catalog from "@/data/services.json";

export const services = catalog.services;
export const webPackages = catalog.webPackages;
export const retainer = catalog.retainer;

export const serviceCount = services.length;

/** Each service has its own page at /services/<id>/. */
export const serviceHref = (id) => `/services/${id}/`;

export const getService = (id) => services.find((service) => service.id === id);
