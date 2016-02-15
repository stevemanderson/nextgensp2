class Mapper:
    @staticmethod
    def getValue(source, key):
        if key in source:
            return source[key]
        return None

class DrupalNodeMapper:
    @staticmethod
    def map(source, target):
        target['id'] = int(source['nid'])
        target['title'] = ''

        target['free_text_available'] = Mapper.getValue(source, 'free_text_available')

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
        target['queryId'] = Mapper.getValue(source, 'linkage query')

class ServiceMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'service'
        if source['customer title'] != None:
            target['title'] = source['customer title']

        target['service_customer_description'] = Mapper.getValue(source, 'service customer description')
        target['service_description_formal'] = Mapper.getValue(source, 'service_description_formal')
        target['service_title'] = Mapper.getValue(source, 'service_title')
        target['phone_number'] = Mapper.getValue(source, 'phone_number')
        target['referral_information'] = Mapper.getValue(source, 'referral_information')
        target['service_region'] = Mapper.getValue(source, 'service_region')
        target['support_area'] = Mapper.getValue(source, 'support_area')
        target['further_information_link'] = Mapper.getValue(source, 'further information link')
        target['application_link'] = Mapper.getValue(source, 'application link')
        target['special_criteria'] = Mapper.getValue(source, 'special criteria')
        target['department'] = Mapper.getValue(source, 'department')
        target['time_valid'] = Mapper.getValue(source, 'time valid')
        target['cost_min'] = Mapper.getValue(source, 'cost min')
        target['cost_max'] = Mapper.getValue(source, 'cost max')
        target['cost_description'] = Mapper.getValue(source, 'cost description')
        target['processing_time'] = Mapper.getValue(source, 'processing time')
        target['actionable'] = Mapper.getValue(source, 'actionable')

        target['service_type'] = 'NEEDS TO BE UPDATED'

class QueryMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'query'
        target['query_detailed_information'] = Mapper.getValue(source, 'query_detailed_information')
        target['title'] = Mapper.getValue(source, 'query short question')

class ResponseMapper:
    @staticmethod
    def map(source, target):
        target['type'] = 'response'
        target['title'] = Mapper.getValue(source, 'responses short')
