interface Image {
  path: string;
  metadata: object;
}

import mongoose from 'mongoose';

const ImageScheme = new mongoose.Schema<Image>({
  path: {
    type: String,
    required: true,
  },

  metadata: {
    type: Object,
    required: true
  },
});

const Images = mongoose.model('Images', ImageScheme, 'Images');

export { Images };
