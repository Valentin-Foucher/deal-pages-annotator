const toggleAnnotatingButtonValue = (isAnnotated) => {
    const checkAnnotator = document.getElementById('annotator');
    if (isAnnotated) {
        checkAnnotator.innerHTML = checkAnnotator.innerHTML.replace('Annotate', 'Deannotate');
    } else {
        checkAnnotator.innerHTML = checkAnnotator.innerHTML.replace('Deannotate', 'Annotate');
    }
}

const reloadListWithAnnotatedUrls = (annotatedUrls) => {
    const ul = document.getElementById('annotated-items-list');
    ul.innerHTML = '';

    annotatedUrls = annotatedUrls ?? [];
    annotatedUrls.forEach((url) => {
        const link = document.createElement('a');
        link.href = url;
        link.innerHTML = url;
        link.target = '_blank';

        const img = document.createElement('img');
        img.src = '../images/cross.svg';
        img.addEventListener('click', function() {
            fetch(``, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(_ => {
                listAnnotatedUrls();
                chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                    toggleAnnotatingButtonValue(url !== tabs[0]?.url);
                });
            });
        });

        const container = document.createElement('div');
        container.appendChild(link)
        container.appendChild(img)

        const li = document.createElement('li');
        li.appendChild(container);
        ul.appendChild(li);
    })
}

const toggleAnnotation = (url) => {
    fetch(``, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        toggleAnnotatingButtonValue(data['is_annotated']);
        listAnnotatedUrls();
    });
}

const initializeDependingIfAnnotated = (url) => {
    fetch(``, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => toggleAnnotatingButtonValue(data['is_annotated']));
}

const listAnnotatedUrls = () => {
    fetch('', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => reloadListWithAnnotatedUrls(data['annotated_urls']));
}

window.onload = function(e) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        initializeDependingIfAnnotated(tabs[0].url);
    });
    listAnnotatedUrls();
}

document.addEventListener('DOMContentLoaded', function() {
    const checkAnnotator = document.getElementById('annotator');
    checkAnnotator.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            toggleAnnotation(tabs[0]?.url);
        });
    })
})

document.addEventListener('DOMContentLoaded', function() {
    const checkAnnotator = document.getElementById('list-toggle');
    checkAnnotator.addEventListener('click', function() {
        const body = document.getElementsByTagName('body')[0];

        // update pop up size
        if (!body.style.width) {
            body.style.width = '400px';
        } else {
            body.style.width = null;
        }

        // update arrow icon
        const l = document.getElementById('annotated-items-list');
        const arrow = document.getElementById('toggle-arrow');

        if (l.style.display == 'none') {
            l.style.display = 'block';
            arrow.src = '../images/up-arrow.png';
        } else {
            l.style.display = 'none';
            arrow.src = '../images/down-arrow.png';
        }
    })
})
