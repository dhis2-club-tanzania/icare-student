package org.openmrs.module.icare.core;

import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.metamodel.Metadata;
import org.hibernate.metamodel.MetadataSources;

public class DBGenerator {
	
	public static void main(String[] args) throws LiquibaseException {
		//ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("gen.xml");
		StandardServiceRegistryBuilder builder = new StandardServiceRegistryBuilder();
		
		Configuration cfg = new Configuration();
		cfg.configure("gen.hibernate.cfg.xml");
		
		//cfg.addDirectory(new File("/home/vincentminde/projects/emr-udsm/development/java/openmrs-docker/omods/icare/api/src/test/resources"));
		cfg.addAnnotatedClass(Item.class);
		//cfg.addXML("mappings.xml");
		
		builder.applySettings(cfg.getProperties());
		MetadataSources metaData = new MetadataSources(builder.build());
		Metadata buildMetadata = metaData.buildMetadata(builder.build());
		SessionFactory s = buildMetadata.buildSessionFactory();
		Session session = s.openSession();
		session.beginTransaction();
		
		Item item = new Item();
		session.save(item);
		
		session.getTransaction().commit();
		
		java.sql.Connection connection = s.openStatelessSession().connection(); //your openConnection logic here
		Database database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(new JdbcConnection(connection));
		Liquibase liquibase = new Liquibase("path/to/changelog.xml", new ClassLoaderResourceAccessor(), database);
		//liquibase.getDatabase().;
	}
}
