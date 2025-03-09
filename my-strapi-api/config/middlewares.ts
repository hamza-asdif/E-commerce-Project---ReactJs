export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: "*", // يمكنك تحديد نطاق معين بدلاً من "*"
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      headers: ["Content-Type", "Authorization"],
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
