class Tree:
    def __init__(self, id, title, root):
        self.id = id
        self.title = title
        self.root = root

    def getLeafNodes(self):
        leafs = []
        for n in self.root.children:
            self.getLeafNodeRec(n, leafs)
        return leafs

    def getLeafNodeRec(self, node, leafs):
        if(len(node.children) == 0):
            leafs.append(node)
            return

        for n in node.children:
            if len(n.children) == 0:
                leafs.append(n)
            else:
                self.getLeafNodeRec(n, leafs)

    def search(self, node, id):
        result = []
        if(node.id == id):
            result.append(node)
        for n in node.children:
            self.searchRecur(n, id, result)
        return result

    def searchRecur(self, node, id, result):
        if(node.id == id):
            result.append(node)
        for n in node.children:
            self.searchRecur(n, id, result)

class Node:
    def __init__(self, pid, id, title, type):
        self.parent = None
        self.type = type
        self.pid = pid
        self.id = id
        self.title = title
        self.children = []

    def addNode(self, node):
        node.parent = self
        self.children.append(node)
