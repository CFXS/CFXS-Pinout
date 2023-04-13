interface Dict {
    [key: string]: HTMLUListElement
}

export class Tree {
    private m_RootNode: HTMLUListElement
    private m_CategoryMap: Dict = {}

    constructor(private _parent: HTMLElement) {
        this.m_RootNode = <HTMLUListElement>document.createElement("ul")
        this.m_RootNode.classList.add("cfxs-tree")
        this.m_RootNode.dataset.path = ":"
        this.m_CategoryMap[":"] = this.m_RootNode
        _parent.appendChild(this.m_RootNode)
    }

    Insert(item: string) {
        var path = item.split("/")
        if (path.length === 0)
            return
        if (path.length === 1) {
            this.AddItem(":", path[0]);
        } else {
            var parent_cat = ":"
            var idx = 0
            for (const e of path) {
                if (idx === path.length - 1) {
                    this.AddItem(parent_cat, e)
                    break;
                }
                this.AddCategory(parent_cat, e)
                parent_cat += "/" + e
                idx++
            }
        }
    }

    private AddItem(path: string | null, name: string) {
        let category_element = this.m_CategoryMap[path]
        let el = document.createElement("li")
        el.classList.add("cfxs-tree-item")
        el.innerText = name
        el.onclick = () => {
            for (var e of category_element.childNodes) {
                (<HTMLElement>e).removeAttribute("selected")
            }
            if (el.getAttribute("selected")) {
                el.removeAttribute("selected")
            } else {
                el.setAttribute("selected", "true")
            }
        }
        category_element.appendChild(el)
    }

    private AddCategory(path: string, name: string) {
        const parent_cat_name = path.substring(0, path.lastIndexOf("/"))

        var category = this.m_CategoryMap[path + "/" + name]
        if (category)
            return

        var parent = this.m_CategoryMap[path]

        var cat = document.createElement("li")
        cat.innerHTML = `
            <details>
                <summary>${name}</summary>
                <ul dataset-path="${path + "/" + name}"></ul>
            </details>
        `
        this.m_CategoryMap[path + "/" + name] = cat.querySelector("ul")
        parent.appendChild(cat)
    }
};