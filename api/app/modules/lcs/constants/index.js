export default {
	
	getTags(){
		return ['математика', 'физика', 'геометрия', 'английский', 'французский', 'арабский', 'узбекский'];
	},

	getTitles(){
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

	getLanguages(){
		return ['Английский', 'Узбекский', 'Французский', 
				'Испанский', 'Арабский', 'Персидский', 
				'Русский', 'Италианский', 'Китайский',
				'Японский', 'Корейский', 'Греческий']
	},

	getSciences(){
		return ['Math', 'Physics', 'Geometry', 'Information', 'Chemistry', 'Biology'];
	},

	getInformation(){
		return ['Word', 'Excel', 'PowerPoint',
				'Интернет', 'C#', 'Javascript',
				'Программирование 1C', 'Python',
				'Java', 'C++', 'RubyOnRails',
				'Базовые навыки по программированию'];
	},

	getProf(){
		return ['','','','','','','',''];
	},

	getExtra(){
		return ['IELTS', 'Подготовка к ЕГЭ',
				'Подготовка к зарубежным университетам',
				'Магистратура','Доктарантура','Аспирантура']
	},

	getCreative(){
		return ['','','','','','','',''];
	},

	getCombined(){
		return ['','','','','','','',''];
	},

	getUnpaid(){
		return ['','','','','','','',''];	
	}
}