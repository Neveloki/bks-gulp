<!DOCTYPE html>
<html>
<head>
    <title>Перечень страниц сайта</title>
    <meta charset="utf-8">
    <style type="text/css">
        * {
            font-family: Verdana;
            font-weight: normal;
        }
        .logo-full {
            height: 100%;
            svg {
                height: 100%;
            }
        }
    </style>
</head>
<body>
<div style="height: 55px; padding: 20px; background: black;">
    <img class="logo-full" src="/html/images/icons_footer-logo.svg" alt="">
</div>

<? if (file_exists("inc_footer.php")) require_once "inc_description.php"; ?>
<table style="margin-top: 30px;">
    <?
    // Функция получения Title страницы
    function page_title($url)
    {
        $fp = file_get_contents($url);
        if (!$fp)
            return null;

        $res = preg_match("/<title>(.*)<\/title>/siU", $fp, $title_matches);
        if (!$res)
            return null;

        // Clean up title: remove EOL's and excessive whitespace.
        $title = preg_replace('/\s+/', ' ', $title_matches[1]);
        $title = trim($title);
        return $title;
    }

    $dontshow = array();
    $ext_exclude = " .ico .png .php .js .json .gitignore";
    $files = array_diff(scandir(__DIR__), $dontshow);
    $i = 1;
    foreach ($files as $file) {
        // Получаем информацию о файле
        $file = pathinfo($file);
        // Получаем title
        $file["title"] = page_title($file["basename"]);

        if (!is_dir($file["basename"]) && !strpos($ext_exclude, $file["extension"])) {
            echo "<tr><td width='300px' style='padding-left: 20px;'>". $i .". <a style='text-decoration: none;' href='" . $file["basename"] . "' target='_blank'>" . $file["title"] . "</a></td> <td><b>" . $file["basename"] . "</b></td></tr>";
            $i++;
        }
    }
    ?>
</table>
<?
/*
$html = new simple_html_dom();
$html->load_file('http://google.com/'); //put url or filename in place of xxx
$title = $html->find('title');
echo $title->plaintext;

$descr = $html->find('meta[description]');
echo $descr->plaintext;
*/
?>
<? if (file_exists("inc_footer.php")) require_once "inc_footer.php"; ?><p>&nbsp;</p>
</body>
</html>