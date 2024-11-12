import mongoose from "mongoose"

const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  count: {
    type: Number,
    default: 0
  }
})

export default mongoose.model("Destination", destinationSchema);
