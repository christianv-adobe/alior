/**
 * columns-feature — two-column brand statement.
 * One row, two columns: text (heading + paragraph + CTA) and a large photo.
 * Image column ordering can be flipped with the "image-first" option.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    const pic = col.querySelector('picture');
    if (pic && col.children.length === 1) {
      col.classList.add('columns-feature-img-col');
    } else {
      col.classList.add('columns-feature-text-col');
      col.querySelectorAll('a').forEach((a) => {
        if (!a.className.includes('button')) a.classList.add('button');
      });
    }
  });
}
