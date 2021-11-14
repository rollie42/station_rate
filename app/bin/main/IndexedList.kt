class Index<T, FieldT>(
    private val collection: Iterable<T>,
    private val groups: Map<FieldT, List<T>>
) : Iterable<T> by collection {
    fun find(target: FieldT): List<T> = groups[target] ?: listOf()
    fun findOneOrNull(target: FieldT): T? = find(target).firstOrNull()
    fun findOne(target: FieldT): T = find(target).first()
}

inline fun <T, FieldT> Index(collection: Iterable<T>, predicate: (T) -> FieldT): Index<T, FieldT>
    = Index(collection, collection.groupBy(predicate))

inline fun <T, FieldT> Iterable<T>.indexedBy(predicate: (T) -> FieldT): Index<T, FieldT>
    = Index(this, predicate)

public inline fun <T, K> Iterable<T>.groupBy2(keySelector: (T) -> K): Map<K, List<T>> {
    return groupByTo(LinkedHashMap<K, MutableList<T>>(), keySelector)
}