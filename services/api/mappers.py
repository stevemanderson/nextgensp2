class Mapper:
    @staticmethod
    def getValue(source, key, target, tKey):
        if key in source:
            target[tKey] = source[key]
        target[tKey] = None

class DrupalNodeMapper:
    @staticmethod
    def map(source, target):
        target['id'] = int(source['nid'])
        target['title'] = ''

        Mapper.getValue(source, 'free_text_available', target, 'free_text_available')

        # check the types
        if source['type'] != None:
            if source['type'] == 'Responses':
                ResponseMapper.map(source, target)
            if source['type'] == 'Queries':
                QueryMapper.map(source, target)
            if source['type'] == 'Services':
                ServiceMapper.map(source, target)
            if source['type'] == 'Linkage':
                LinkageMapper.map(source, target)

        if source['response format'] != None:
            target['format'] = str(source['response format']).lower()

        if 'format' not in target:
            target['format'] = 'default'

        # Use the node title
        if len(target['title']) == 0:
            if source['node_title'] != None:
                target['title'] = source['node_title']

class LinkageMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'linkage'
        Mapper.getValue(source, 'linkage query', target, 'queryId')

class ServiceMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'service'
        if source['customer title'] != None:
            target['title'] = source['customer title']

        target['service_customer_description'] = source['service customer description']
        target['service_description_formal'] = source['service_description_formal']
        target['service_title'] = source['service_title']
        target['phone_number'] = source['phone_number']
        target['referral_information'] = source['referral_information']
        target['service_region'] = source['service_region']
        target['support_area'] = source['support_area']
        target['further_information_link'] = source['further information link']
        target['application_link'] = source['application link']
        target['special_criteria'] = source['special criteria']
        target['department'] = source['department']
        target['time_valid'] = source['time valid']
        target['cost_min'] = source['cost min']
        target['cost_max'] = source['cost max']
        target['cost_description'] = source['cost description']
        target['processing_time'] = source['processing time']

        target['service_type'] = 'NEEDS TO BE UPDATED'

class QueryMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'query'
        if source['query short question'] != None:
            target['title'] = source['query short question']

class ResponseMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'response'

        if source['responses short'] != None:
            target['title'] = source['responses short']
