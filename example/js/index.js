import { generatorMenubar } from './sidebarTemplate';
import { addChildPage, loadChildPage } from './childPageTemplate';
import { searchMenu } from './search';
import menuData from './data';

generatorMenubar(menuData);
addChildPage(document.getElementById('content'));

if (window.location.hash) {
    for (let obj of menuData) {
        for (let sub of obj.subitems) {
            if (window.location.hash == `#${(sub.title).replace(/\s+/g, "")}`){
                loadChildPage(sub);
            }
         }
    }
} else {
    loadChildPage(menuData[0].subitems[0]);
}

//click the li, addClass active.
let sidebarClickHandle = () => {
    $('#menu-bar>ul>li').on('click', function () {
        $('#menu-bar>ul>li').removeClass('active');
        $(this).addClass('active');
        let styleName = $(this).parent().prev().children().text();
        let title = $(this).children().children().text();
        for (let obj of menuData) {
            if (obj.styleName === styleName) {
                for (let sub of obj.subitems) {
                    if (sub.title === title) {
                        loadChildPage(sub);
                        break;
                    }
                }
                break;
            }
        }
    });
}
sidebarClickHandle();

document.getElementById('sidebar-search').oninput = () => {
    searchMenu($('#sidebar-search').val())
};

export default sidebarClickHandle;