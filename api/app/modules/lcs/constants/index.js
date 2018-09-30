import { LC } from '../models';
import { Tutor } from '../../tutors';

export default {
	
	async getTags(){
		return ['математика', 'физика', 'геометрия', 'английский', 'французский', 'арабский', 'узбекский'];
	},

	async getTitles(){
		return [	{ title: 'Языковые курсы', request: 'languages' }, 
					{ title: 'Точные науки', request: 'sciences' }, 
					{ title: 'Компьютерные курсы', request: 'information' },
					{ title: 'Профессиональные курсы', request: 'prof' },
					{ title: 'Подготовительные курсы', request: 'extra' }, 
					{ title: 'Творческие', request: 'сreative' },
					{ title: 'Комбинированные', request: 'combined' },
					{ title: 'Бесплатные', request: 'unpaid' }
				];
	},

	async getLanguages(){
		return ['Английский', 'Узбекский', 'Французский', 
				'Испанский', 'Арабский', 'Персидский', 
				'Русский', 'Италианский', 'Китайский',
				'Японский', 'Корейский', 'Греческий']
	},

	async getSciences(){
		return ['Math', 'Physics', 'Geometry', 'Information', 'Chemistry', 'Biology'];
	},

	async getInformation(){
		return ['Word', 'Excel', 'PowerPoint',
				'Интернет', 'C#', 'Javascript',
				'Программирование 1C', 'Python',
				'Java', 'C++', 'RubyOnRails',
				'Базовые навыки по программированию'];
	},

	async getProf(){
		return ['','','','','','','',''];
	},

	async getExtra(){
		return ['IELTS', 'Подготовка к ЕГЭ',
				'Подготовка к зарубежным университетам',
				'Магистратура','Доктарантура','Аспирантура']
	},

	async getCreative(){
		return ['','','','','','','',''];
	},

	async getCombined(){
		return ['','','','','','','',''];
	},

	async getUnpaid(){
		return ['','','','','','','',''];	
	},
}