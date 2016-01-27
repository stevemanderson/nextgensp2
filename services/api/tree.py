import json

class Tree:
    def __init__(self, root):
        self.root = root

    def getLeafNodes(self):
        leafs = []
        for n in self.root['children']:
            self.getLeafNodeRec(n, leafs)
        return leafs

    def getLeafNodeRec(self, node, leafs):
        if(len(node['children']) == 0):
            leafs.append(node)
            return

        for n in node['children']:
            if 'children' in n and len(n['children']) == 0:
                leafs.append(n)
            else:
                self.getLeafNodeRec(n, leafs)

    def search(self, node, id):
        result = []
        if(node['id'] == id):
            result.append(node)
        for n in node['children']:
            self.searchRecur(n, id, result)
        return result

    def searchRecur(self, node, id, result):
        if(node['id'] == id):
            result.append(node)
        for n in node['children']:
            self.searchRecur(n, id, result)

    def flattenTree(self):
        result = []
        self.flattenTreeRecur(self.root, result)
        return result

    def flattenTreeRecur(self, node, result):
        result.append(node)
        for n in node['children']:
            self.flattenTreeRecur(n, result)

class Node:
    def __init__(self, id, title, type):
        self.type = type
        self.id = id
        self.title = title
        self.children = []

    def addNode(self, node):
        self.children.append(node)
