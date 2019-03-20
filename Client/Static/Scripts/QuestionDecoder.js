
function decode_node(node)
{
    if (node.nodeName == '#text')
        return node.textContent

    let output = ''
    node.childNodes.forEach((child) => 
    {
        let text = decode_node(child)
        text = text.split('\n').join('<br>')

        switch(child.nodeName)
        {
            case 'bold':
                output += '<b>' + text + '</b>'
                break

            case 'center':
                output += 
                    '<text style="display:block;text-align:center">' + 
                    text + '</text>'
                break

            case 'equation':
                output += '$$' + text + '$$'
                break

            default: 
                output += text
                break
        }
    })

    return output
}

function decode_question(src)
{
    let parser = new DOMParser()
    let doc = parser.parseFromString(
        '<question>' + src + '</question>', 
        'text/xml')
    
    let question = doc.childNodes[0]
    return decode_node(question)
}
