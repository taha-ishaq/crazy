import mongoose, { Schema } from 'mongoose'
import { ISliderModule } from './interface/ISlider'

const sliderSchema: Schema<ISliderModule.ISliderObject> =
	new mongoose.Schema<ISliderModule.ISliderObject>({
		url: {
			type: String,
		},
		image: {
			type: String,
		},
	})

const Slider = mongoose.model('Slider', sliderSchema)
export default Slider
