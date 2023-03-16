const sanitizePlugin = (schema) => {
  schema.plugin((schema) => {
    schema.set('toJSON', {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
      virtuals: true,
      versionKey: false,
      getters: true,
      sanitizeFilter: true, // <-- set sanitizeFilter as a global option
    });
  });
};

export { sanitizePlugin };
